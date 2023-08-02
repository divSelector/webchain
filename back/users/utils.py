from Crypto.Cipher import AES
from django.conf import settings

key = bytes.fromhex(settings.ENCRYPTION_KEY)

def encrypt(data, key=key):
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data)
    return cipher.nonce + tag + ciphertext

def decrypt(encrypted_data, key=key):
    nonce = encrypted_data[:16]
    tag = encrypted_data[16:32]
    ciphertext = encrypted_data[32:]

    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag)

