from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from huggingface_hub import InferenceClient
import json

app = Flask(__name__)
CORS(app)

HF_TOKEN = ""# write your own Token ID
repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"

llm_client = InferenceClient(
    model=repo_id,
    token=HF_TOKEN,
    timeout=120,
)

def call_llm(inference_client: InferenceClient, user_message: str):
    prompt = f"İklim değişikliğinin dünyamız üzerindeki etkilerini konu alan bir hikaye oluştur. Bu hikaye, insanları farkındalık kazanmaya ve harekete geçmeye motive edecek şekilde yazılsın. Karakterler insan veya hayvan olabilir; hayvan karakterler kullanırsan, iklim değişikliğinin doğal yaşam üzerindeki etkilerini vurgula. Hikayenin sonunda, güçlü ve motive edici bir mesaj vererek okuyucuları harekete geçmeye teşvik et. Hikaye duygusal, ilham verici ve harekete geçirici olmalıdır.\nKonu şu şekilde:{user_message}\nAssistant:"
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 500,
                "temperature": 0.7,
                "top_p": 0.9,
                "do_sample": True
            },
            "task": "text-generation",
        },
    )
    return json.loads(response.decode())[0]["generated_text"].split("Assistant:")[-1].strip()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/hakkimizda')
def hakkimizda():
    return render_template('hakkimizda.html')

@app.route('/iletisim')
def iletisim():
    return render_template('iletisim.html')

@app.route('/create_a_story')
def create_a_story():
    return render_template('create_a_story.html')

@app.route('/source')
def source():
    return render_template('source.html')

@app.route('/get-ai-response', methods=['POST'])
def get_ai_response():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Message not found.'}), 400

    user_message = data['message']

    try:
        ai_response = call_llm(llm_client, user_message)
        return jsonify({'response': ai_response})
    except Exception as e:
        return jsonify({'error': 'Server error: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=10000)
