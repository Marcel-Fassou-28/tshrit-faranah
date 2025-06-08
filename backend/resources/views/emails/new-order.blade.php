@component('mail::message')
# Nouvelle commande

Bonjour,

Une nouvelle commande a été passée sur T-Shirt Faranah. Voici les détails :

## Client
- Nom : {{ $user->nom }} {{ $user->prenom }}
- E-mail : {{ $user->email }}
- Téléphone : {{ $user->telephone }}

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

Veuillez traiter cette commande dès que possible.

Cordialement,<br>
L'équipe T-Shirt Faranah
@endcomponent