<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommandNotification extends Notification
{
    use Queueable;

    protected $orderDetails;
    protected $adresse;
    protected $user;

    public function __construct($orderDetails, $adresse, $user)
    {
        $this->orderDetails = $orderDetails;
        $this->adresse = $adresse;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Nouvelle commande')
            ->markdown('emails.new-order', [
                'orderDetails' => $this->orderDetails,
                'adresse' => $this->adresse,
                'user' => $this->user,
            ]);
    }
}
