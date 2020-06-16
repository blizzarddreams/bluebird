<?php

namespace Bluebird\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;


class CommentRequest extends FormRequest
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
            'comment_type.required' => 'The comment type field is required.',
            'data.max' => 'The data field may not be greater than 4000 characters.'
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
            'data' => 'required|max:4000|min:1',
            'id' => 'required|numeric',
            'comment_type' => 'required|in:image,journal,profile'
        ];
    }
}
