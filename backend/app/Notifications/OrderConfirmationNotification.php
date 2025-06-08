<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class OrderConfirmationNotification extends Notification
{
    use Queueable;

    protected $orderDetails;
    protected $adresse;

    public function __construct($orderDetails, $adresse)
    {
        $this->orderDetails = $orderDetails;
        $this->adresse = $adresse;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Confirmation de votre commande')
            ->markdown('emails.order-confirmation', [
                'orderDetails' => $this->orderDetails,
                'adresse' => $this->adresse,
                'notifiable' => $notifiable,
            ]);
    }
}
