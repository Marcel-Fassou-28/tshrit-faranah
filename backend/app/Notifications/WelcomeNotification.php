<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur Faranah Tshirt !')
            ->greeting('Bonjour ' . $this->user->prenom . ' !')
            ->line('Merci de vous êtes inscrits sur Faranah Tshirt.')
            ->line('Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter pour commencer à explorer nos voitures.')
            ->action('Se connecter', config('app.frontend_url', 'http://localhost:5173') . '/login');
    }
}