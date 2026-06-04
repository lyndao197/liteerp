import os
import json
from dotenv import load_dotenv

# Load environment variables (GEMINI_API_KEY)
load_dotenv()

from llama_index.core import VectorStoreIndex, Document
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core import Settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory

print("Đang khởi tạo Hệ thống Agent...")

# ==========================================
# 1. CẤU HÌNH LLAMAINDEX (Dành cho truy xuất dữ liệu - RAG)
# ==========================================

# Cấu hình LlamaIndex sử dụng Gemini
api_key = os.environ.get("GEMINI_API_KEY")
llm = Gemini(model="models/gemini-1.5-pro", api_key=api_key)
embed_model = GeminiEmbedding(model_name="models/embedding-001", api_key=api_key)

Settings.llm = llm
Settings.embed_model = embed_model

# Đọc dữ liệu từ file data.json
print("- Đang đọc dữ liệu từ data.json...")
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Chuyển đổi dữ liệu JSON thành các Document để LlamaIndex hiểu
documents = []
for obj_type, obj_data in data.items():
    if isinstance(obj_data, dict):
        for item_id, item_content in obj_data.items():
            text_content = f"Loại: {obj_type}\nID: {item_id}\nChi tiết: {json.dumps(item_content, ensure_ascii=False)}"
            documents.append(Document(text=text_content))

print(f"- Đã tạo {len(documents)} documents. Đang lập chỉ mục (Indexing)... (Quá trình này mất khoảng 15-30 giây)")

# Tạo Vector Store Index (Trí nhớ dài hạn của Agent về dữ liệu công ty)
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()

def query_erp_data(query: str) -> str:
    """Sử dụng công cụ này để tra cứu thông tin về Hợp đồng, Khách hàng, Đơn hàng trong hệ thống Lite ERP."""
    response = query_engine.query(query)
    return str(response)

# ==========================================
# 2. CẤU HÌNH LANGCHAIN (Dành cho Tư duy Agent)
# ==========================================

# Khai báo công cụ (Tools) cho Agent
tools = [
    Tool(
        name="LiteERP_Database_Search",
        func=query_erp_data,
        description="Sử dụng khi bạn cần tìm kiếm, tra cứu thông tin cụ thể về hợp đồng, khách hàng, nhân viên, chiến dịch trong cơ sở dữ liệu."
    )
]

# Khởi tạo Bộ não của Agent bằng Langchain + Gemini
agent_llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key, temperature=0.2)

# Khởi tạo bộ nhớ ngắn hạn cho Agent
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Khởi tạo Agent
agent = initialize_agent(
    tools=tools,
    llm=agent_llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True, # Bật verbose để xem Agent "suy nghĩ"
    handle_parsing_errors=True
)

print("\n==============================================")
print("KHỞI TẠO THÀNH CÔNG! BẠN CÓ THỂ BẮT ĐẦU CHAT VỚI AGENT.")
print("Gõ 'thoát' để dừng chương trình.")
print("==============================================\n")

while True:
    user_input = input("\nBạn: ")
    if user_input.lower() == 'thoát':
        break
    
    # Cho Agent suy nghĩ và trả lời
    response = agent.run(user_input)
    print(f"\nAgent: {response}")
