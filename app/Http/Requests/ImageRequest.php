<?php

namespace Bluebird\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ImageRequest extends FormRequest
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

    /*public function messages()
    {
      return [
        'rating.required' => 'A rating must be selected.'
      ];
    }*/
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|max:2000|min:1',
            'description' => 'nullable',
            'image' => 'sometimes|required|image',
            'tags' => 'nullable',
            'rating' => 'required', Rule::in(["sfw", "nsfw"])
        ];
    }
}
