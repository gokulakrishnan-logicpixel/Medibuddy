# store_index.py - FIXED VERSION (Modern LangChain)
from langchain_pinecone import PineconeVectorStore
from src.helper import load_pdf, text_split, download_hugging_face_embeddings
import os
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')

# Load data pipeline
print("📄 Loading PDFs...")
extracted_data = load_pdf(data='data/')

print("✂️ Creating chunks...")
text_chunks = text_split(extracted_data)

print(f"✅ Created {len(text_chunks)} chunks!")

print("🔗 Downloading embeddings...")
embeddings = download_hugging_face_embeddings()

# MODERN PINECONE SETUP (No deprecated Pinecone class)
index_name = "medibuddy-trials"

# Connect or create index
try:
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings
    )
    print("✅ Connected to existing Pinecone index!")
except:
    from pinecone import Pinecone, ServerlessSpec
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Delete if exists
    if index_name in pc.list_indexes().names():
        pc.delete_index(index_name)
    
    # Create new index
    pc.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    
    # Store documents
    docsearch = PineconeVectorStore.from_documents(
        documents=text_chunks,
        index_name=index_name,
        embedding=embeddings
    )
    print("✅ Documents embedded and stored in Pinecone!")

print(docsearch)
print("🎉 Medibuddy index ready!")
