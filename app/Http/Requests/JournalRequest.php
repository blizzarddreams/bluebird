<?php

namespace Bluebird\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class JournalRequest extends FormRequest
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
     * Messages sent to user if validation fails.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'data.max' => 'The data field may not be greater than 20000 characters.',
            'title.max' => 'The title field may not be greater than 1000 characters.'
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
            'title' => 'required|max:1000',
            'data' => 'required|max:20000'
        ];
    }
}
