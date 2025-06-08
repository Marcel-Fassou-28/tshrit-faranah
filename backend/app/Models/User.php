<?php

namespace App\Models;

use App\Notifications\CustomResetPassword;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 * 
 * @property int $id
 * @property string $nom
 * @property string $prenom
 * @property string $email
 * @property string|null $role
 * @property string $password
 * @property string|null $token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'role' => 'string',
    ];

    protected $hidden = [
        'password',
        'token',
    ];

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'role',
        'password',
        'telephone',
        'token',
    ];

    public function paniers(): HasMany
    {
        return $this->hasMany(Panier::class, 'user_id');
    }

    public function adressesLivraison(): HasMany
    {
        return $this->hasMany(AdressesLivraison::class, 'user_id');
    }

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class, 'user_id');
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }

    
}
