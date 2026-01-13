from dotenv import load_dotenv
import os
from groq import Groq
from transformers import RagRetriever
load_dotenv()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

def medibuddy_groq(query):
    """Production Medibuddy with "I don't know" safety"""
    docs = RagRetriever.invoke(query)
    
    # SAFETY CHECK: If no relevant medical docs found
    if not docs or len(docs) == 0 or all(len(doc.page_content.strip()) < 50 for doc in docs):
        return "**🩺 Medibuddy:** I don't have information about that topic in my medical encyclopedia. Please ask about medical conditions, treatments, or symptoms."
    
    context = "\n".join([doc.page_content[:800] for doc in docs[:3]])
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system", 
                "content": """You are Medibuddy, a professional medical assistant. 
                Answer using ONLY the medical encyclopedia context provided. 
                Give concise, accurate answers in 2-3 sentences.
                If the context doesn't contain relevant medical information, say "I don't know." """
            },
            {
                "role": "user", 
                "content": f"CONTEXT:\n{context}\n\nQUESTION: {query}"
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=300
    )
    
    return f"**🩺 Medibuddy:** {chat_completion.choices[0].message.content.strip()}"