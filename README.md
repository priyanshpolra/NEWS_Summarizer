# NEWS Summarizer

News Summarizer is a web application that generates concise summaries of news articles using a link. It uses an AWS Lambda backend to fetch and process article content, and a frontend interface to interact with the API, providing a fast and efficient way to understand news quickly.

---

## Features

* Summarizes news articles using a URL.
* Serverless backend powered by AWS Lambda.
* Frontend interface for easy interaction.
* CORS-enabled API to allow cross-origin requests.

---

## Installation

### Backend (AWS Lambda)

1. Clone the repository:

```bash
git clone https://github.com/priyanshpolra/NEWS_Summarizer.git
```

2. Navigate to the backend folder:

```bash
cd NEWS_Summarizer/backend
```

3. Install dependencies:

```bash
npm install
```

4. Zip the Lambda function:

```bash
zip -r function.zip index.js package.json package-lock.json node_modules
```

5. Update your Lambda function code using AWS CLI:

```bash
aws lambda update-function-code --function-name YourLambdaFunctionName --zip-file fileb://function.zip
```

6. Make sure your Lambda function has CORS enabled to allow requests from your frontend.

---

### Frontend

1. Navigate to the frontend folder:

```bash
cd NEWS_Summarizer/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and use the frontend interface to summarize articles via URL.

---

## Usage

* Use the frontend interface to input a news article URL.
* The frontend sends a POST request to the Lambda endpoint with the URL.
* The response returns a concise summary of the article.

Example POST request:

```json
{
  "url": "https://example.com/news-article"
}
```

---

## Technologies Used

* **AWS Lambda** – serverless backend for fetching and processing articles
* **Node.js** – runtime for Lambda function
* **Frontend** – React-based interface for users
* **OpenAI API** – for summarization logic

---
## Author

**Priyansh Polra**

* GitHub: [@priyanshpolra](https://github.com/priyanshpolra)
* LinkedIn: [Priyansh Polra](https://www.linkedin.com/in/priyanshpolra/)

---