@component('mail::message')
# Confirmation de votre commande

Bonjour {{ $notifiable->prenom }},

Merci pour votre commande sur T-Shirt Faranah ! Voici les détails :

## Articles commandés
@foreach($orderDetails['items'] as $item)
- {{ $item['name'] }} (Taille : {{ $item['taille'] }}, Quantité : {{ $item['quantity'] }}) : {{ number_format($item['prix_total'], 0, ',', ' ') }} GNF
@endforeach

## Montant total
{{ number_format($orderDetails['montant_total'], 0, ',', ' ') }} GNF

## Adresse de livraison
{{ $adresse->nom_complet }}<br>
{{ $adresse->adresse_1 }}{{ $adresse->adresse_2 ? ', ' . $adresse->adresse_2 : '' }}<br>
{{ $adresse->ville }}<br>
Téléphone : {{ $adresse->telephone }}

Merci de votre confiance !

Cordialement,<br>
L'équipe Soumah Shine
@endcomponent