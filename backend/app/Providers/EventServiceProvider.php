<?php

namespace App\Providers;

use Illuminate\Auth\Events\PasswordReset;
use App\Listeners\SendPasswordChangedNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PasswordReset::class => [
            SendPasswordChangedNotification::class,
        ],
    ];

    public function boot()
    {
        //
    }
}