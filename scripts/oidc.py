# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "requests",
# ]
# ///

import requests
import urllib.parse
import webbrowser
import secrets
import base64
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

OIDC_DISCOVERY_URL = "http://localhost:8090/realms/app/.well-known/openid-configuration"
OIDC_CLIENT_ID = "cli"
OIDC_CLIENT_SECRET = "TAkKZ9SVGIJQjKLH0e5lQbBHkhQyizPg"
OIDC_REDIRECT_URI = "http://localhost:3333/callback"
OIDC_SCOPES = "openid profile email"

class OIDCClient:
    def __init__(self):
        self.discovery_data = None
        self.code_verifier = None
        self.authorization_code = None
        self.tokens = {}
        
    def fetch_discovery_document(self):
        try:
            response = requests.get(OIDC_DISCOVERY_URL)
            response.raise_for_status()
            self.discovery_data = response.json()
            return True
        except Exception as e:
            print(f"Error fetching discovery document: {e}")
            return False
    
    def generate_pkce_params(self):
        self.code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(self.code_verifier.encode('utf-8')).digest()
        ).decode('utf-8').rstrip('=')
        return code_challenge
    
    def build_authorization_url(self):
        if not self.discovery_data:
            raise Exception("Discovery document not loaded")
        
        code_challenge = self.generate_pkce_params()
        state = secrets.token_urlsafe(32)
        
        params = {
            'response_type': 'code',
            'client_id': OIDC_CLIENT_ID,
            'redirect_uri': OIDC_REDIRECT_URI,
            'scope': OIDC_SCOPES,
            'state': state,
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256'
        }
        
        auth_url = f"{self.discovery_data['authorization_endpoint']}?{urllib.parse.urlencode(params)}"
        return auth_url, state
    
    def exchange_code_for_tokens(self, authorization_code):
        if not self.discovery_data:
            raise Exception("Discovery document not loaded")
        
        token_data = {
            'grant_type': 'authorization_code',
            'client_id': OIDC_CLIENT_ID,
            'client_secret': OIDC_CLIENT_SECRET,
            'code': authorization_code,
            'redirect_uri': OIDC_REDIRECT_URI,
            'code_verifier': self.code_verifier
        }
        
        try:
            response = requests.post(
                self.discovery_data['token_endpoint'],
                data=token_data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            response.raise_for_status()
            self.tokens = response.json()
            return True
        except Exception as e:
            print(f"Error exchanging code for tokens: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Response: {e.response.text}")
            return False

class CallbackHandler(BaseHTTPRequestHandler):
    def __init__(self, oidc_client, *args, **kwargs):
        self.oidc_client = oidc_client
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        if parsed_path.path == '/callback':
            if 'code' in query_params:
                code = query_params['code'][0]
                self.oidc_client.authorization_code = code
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'''
                <html>
                <body>
                    <h1>Authorization successful!</h1>
                    <p>You can close this window and return to the terminal.</p>
                    <script>window.close();</script>
                </body>
                </html>
                ''')
            elif 'error' in query_params:
                error = query_params['error'][0]
                error_description = query_params.get('error_description', ['Unknown error'])[0]
                
                self.send_response(400)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f'''
                <html>
                <body>
                    <h1>Authorization failed!</h1>
                    <p>Error: {error}</p>
                    <p>Description: {error_description}</p>
                </body>
                </html>
                '''.encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, fmt, *args):
        pass

def run_callback_server(oidc_client):
    def handler(*args, **kwargs):
        return CallbackHandler(oidc_client, *args, **kwargs)
    
    server = HTTPServer(('localhost', 3333), handler)
    server.timeout = 1
    
    while not oidc_client.authorization_code:
        server.handle_request()
    
    server.server_close()

def main():
    print("OIDC Authorization Code Flow CLI")
    print("=" * 40)
    
    client = OIDCClient()
    
    print("1. Fetching OIDC discovery document...")
    if not client.fetch_discovery_document():
        print("Failed to fetch discovery document. Exiting.")
        return
    
    print("2. Building authorization URL...")
    try:
        auth_url, _ = client.build_authorization_url()
    except Exception as e:
        print(f"Error building authorization URL: {e}")
        return
    
    print("3. Starting local callback server...")
    server_thread = threading.Thread(target=run_callback_server, args=(client,))
    server_thread.daemon = True
    server_thread.start()
    
    print("4. Opening browser for authorization...")
    print(f"Authorization URL: {auth_url}")
    webbrowser.open(auth_url)
    
    print("Waiting for authorization callback...")
    timeout = 300
    start_time = time.time()
    
    while not client.authorization_code and (time.time() - start_time) < timeout:
        time.sleep(1)
    
    if not client.authorization_code:
        print("Timeout waiting for authorization. Exiting.")
        return
    
    print("5. Exchanging authorization code for tokens...")
    if not client.exchange_code_for_tokens(client.authorization_code):
        print("Failed to exchange code for tokens. Exiting.")
        return
    
    print("\n" + "=" * 40)
    print("SUCCESS! Tokens retrieved:")
    print("=" * 40)
    
    if 'access_token' in client.tokens:
        print(f"\nAccess Token:")
        print(f"{client.tokens['access_token']}")
    
    if 'id_token' in client.tokens:
        print(f"\nID Token:")
        print(f"{client.tokens['id_token']}")
    
    if 'refresh_token' in client.tokens:
        print(f"\nRefresh Token:")
        print(f"{client.tokens['refresh_token']}")
    
    if 'expires_in' in client.tokens:
        print(f"\nExpires in: {client.tokens['expires_in']} seconds")
    
    if 'token_type' in client.tokens:
        print(f"Token type: {client.tokens['token_type']}")

if __name__ == "__main__":
    main()