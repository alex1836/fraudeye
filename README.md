# FraudEye - AI Fraud Detection System

## 🚀 How to Run the Real Backend (API)

To test this system with **Real Data** from Postman or an external Bank integration, you need to run the Python backend.

### 1. Install Python Dependencies
Open your terminal in the project folder:
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server
```bash
uvicorn main:app --reload
```
The API will be live at: `http://127.0.0.1:8000`

### 3. Expose to the Internet (Optional)
If you want to send data from an external server (like a real bank webhook):
1. Install [Ngrok](https://ngrok.com/)
2. Run: `ngrok http 8000`
3. Copy the `https://....ngrok-free.app` URL.

### 4. Test with Postman
**POST** `http://127.0.0.1:8000/v1/predict`
**Body (JSON):**
```json
{
  "transaction_id": "txn_999",
  "amount": 5000,
  "merchant": "Unknown Store",
  "category": "Electronics",
  "location": "New York, US"
}
```

## 💻 Frontend Setup
1. `npm install`
2. `npm start`
