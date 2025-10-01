from django.shortcuts import render
from .models import Product
from django.http import JsonResponse
import json

from google.oauth2 import service_account
from googleapiclient.discovery import build

def home(request):
    products = Product.objects.all()
    context = {'products': products}
    return render(request, 'store/home.html', context)


from datetime import datetime

def process_order(request):
    print("Request received to process order")
    if request.method == 'POST':
        data = json.loads(request.body)
        cart = data.get('cart')
        phone_number = data.get('phone')
        order_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Informations pour Google Sheets
        SERVICE_ACCOUNT_FILE = 'credentials.json'  # Nom du fichier de vos identifiants
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        SPREADSHEET_ID = '10r0Si9j2AmyUtHLHwEyUmZ7TN306WTI_GskYNTDOd-4'  # À remplacer par l'ID de votre feuille
        RANGE_NAME = 'order!A1'  # À remplacer par le nom de votre feuille et la plage

        try:
            creds = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            service = build('sheets', 'v4', credentials=creds)
            sheet = service.spreadsheets()

            # Préparer les données à envoyer
            values = []
            for item in cart:
                values.append([item['name'], item['price'], phone_number, order_date])

            body = {
                'values': values
            }

            # Envoyer les données
            result = sheet.values().append(
                spreadsheetId=SPREADSHEET_ID,
                range=RANGE_NAME,
                valueInputOption='RAW',
                body=body
            ).execute()

            print(f"{result.get('updates').get('updatedCells')} cellules ajoutées.")
            return JsonResponse({'status': 'success', 'message': 'Commande enregistrée avec succès!'})

        except Exception as e:
            print(f"Une erreur est survenue : {e}")
            return JsonResponse({'status': 'error', 'message': 'Erreur lors de l\'enregistrement de la commande.'}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Méthode non autorisée'}, status=405)
