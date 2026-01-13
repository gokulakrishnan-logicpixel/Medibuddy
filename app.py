from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from langchain_pinecone import PineconeVectorStore
from src.helper import download_hugging_face_embeddings
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()

PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

embeddings = download_hugging_face_embeddings()
index_name = "medibuddy-trials"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

client = Groq(api_key=GROQ_API_KEY)

def medibuddy_groq(query):
    docs = retriever.invoke(query)
    if not docs or len(docs) == 0 or all(len(doc.page_content.strip()) < 50 for doc in docs):
        return "I don't have information about that topic."
    context = "\n".join([doc.page_content[:800] for doc in docs[:3]])
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are Medibuddy, a professional medical assistant."},
            {"role": "user", "content": f"CONTEXT:\n{context}\n\nQUESTION: {query}"}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=300
    )
    return chat_completion.choices[0].message.content.strip()

@app.route('/get', methods=['POST'])
def chat():
    msg = request.form.get("msg", "")
    print(f"🔍 GOT QUERY: {msg}")
    result = medibuddy_groq(msg)
    print(f"✅ SENDING: {result[:100]}...")
    return jsonify({"answer": result, "status": "success"})  # ✅ key matches frontend

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)