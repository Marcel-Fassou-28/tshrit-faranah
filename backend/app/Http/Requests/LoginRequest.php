<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;                
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'  => 'L’e-mail est obligatoire.',
            'email.email'     => 'L’e-mail  n’est pas valide.',
            'email.exists'    => 'Vos identifiants sont incorrectes.',
            'password.required'=> 'Le mot de passe est obligatoire.',
            'password.min'    => 'Le mot de passe doit contenir au moins :min caractères.',
        ];
    }
}
