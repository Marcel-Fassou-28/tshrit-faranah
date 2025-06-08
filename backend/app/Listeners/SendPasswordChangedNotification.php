<?php

namespace App\Listeners;

use Illuminate\Auth\Events\PasswordReset;
use App\Notifications\PasswordChangedNotification;

class SendPasswordChangedNotification
{
    public function handle(PasswordReset $event)
    {
        $event->user->notify(new PasswordChangedNotification());
    }
}
