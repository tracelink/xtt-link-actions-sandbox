import assert from 'assert';
import { NetsuiteOAuth2 } from '../NetsuiteOAuth2.js'; 

describe('NetsuiteOAuth2', () => {
  let netsuiteOAuth2;

  beforeEach(() => {
    // Mock HttpClient
    const mockHttpClient = {
      post: () => ({
        body: JSON.stringify({ access_token: 'mock_token' })
      })
    };
    netsuiteOAuth2 = new NetsuiteOAuth2(mockHttpClient);
  });

  describe('#generateToken()', () => {
    it('should generate token successfully', () => {
      const token = netsuiteOAuth2.generateToken();
      assert.strictEqual(token, 'mock_token');
    });

    it('should return cached token if available', () => {
      netsuiteOAuth2.setBearerToken('cached_token');
      const token = netsuiteOAuth2.generateToken();
      assert.strictEqual(token, 'cached_token');
    });

    it('should handle missing secrets', () => {
      const originalReadSecrets = netsuiteOAuth2.readSecrets;
      netsuiteOAuth2.readSecrets = () => {
        throw new Error('Secrets are missing');
      };

      assert.throws(() => netsuiteOAuth2.generateToken(), "Error in generateToken. Check secrets.json file. Error :  Error: Secrets are missing");

      netsuiteOAuth2.readSecrets = originalReadSecrets;
    });
  });
});
