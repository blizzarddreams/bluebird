<?php

namespace Bluebird\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'A username is required.',
            'email.required' => 'An email is required.',
            'password.required' => 'A password is required.',
            'birthday.required' => 'A birthday is required.',
            'name.unique' => ':input is already taken.',
            'email.unique' => ':input is already taken.',
            'password.min' => 'password must be equal or more than 8 characters.',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|unique:users|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|string',//|confirmed',
            'birthday' => 'required|date',
        ];
    }
}
