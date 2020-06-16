<?php

namespace Bluebird\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;


class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'sometimes|alpha_dash|unique:users,name,'.Auth::user()->id,
            'description' => 'sometimes|nullable',
            'tagline' => 'sometimes|nullable'
        ];
    }
}
