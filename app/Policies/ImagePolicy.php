<?php

namespace Bluebird\Policies;

use Bluebird\Image;
use Bluebird\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ImagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any images.
     *
     * @param  \Bluebird\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can favorite the image.
     * @param \Bluebird\User $user
     * @param \Bluebird\Image $image
     * @return mixed
     */
    public function favorite(User $user, Image $image)
    {
        return $user->id !== $image->user_id;
    }

    /**
     * Determine whether the user can feature the image.
     *
     * @param \Bluebird\User $user
     * @param \Bluebird\Image $image
     * @return mixed
     */
    public function feature(User $user, Image $image)
    {
        return $user->id === $image->user_id;
    }

    /**
     * Determine whether the user can view the image.
     *
     * @param  \Bluebird\User  $user
     * @param  \Bluebird\Image  $image
     * @return mixed
   /*  */
    public function view(?User $user, Image $image)
    {
        if ($image->nsfw) {
            if ($user) {
                return optional($user)->age >= 18;
            }
        } else {
            return true;
        }
    }

    /**
     * Determine whether the user can create images.
     *
     * @param  \Bluebird\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the image.
     *
     * @param  \Bluebird\User  $user
     * @param  \Bluebird\Image $image
     * @return mixed
     */
    public function update(User $user, Image $image)
    {
        return $user->id == $image->user_id;
    }

    /**
     * Determine whether the user can delete the image.
     *
     * @param  \Bluebird\User  $user
     * @param  \Bluebird\Image $image
     * @return mixed
     */
    public function delete(User $user, Image $image)
    {
        return $user->id == $image->user_id;
    }

    /**
     * Determine whether the user can mass delete the images.
     *
     * @param \Bluebird\User $user
     * @param array $images
     * @return mixed
     */

    public function massDestroy(User $user, array $images)
    {
        //return dd($images);
        $userImageIds = $user->images()->pluck('id')->toArray();
       // $imageIds = array_values($images);
        return count(array_intersect($images, $userImageIds)) == count($images);
    }

    /**
     * Determine whether the user can favorite the image.
     * @param \Bluebird\User $user
     * @param \Bluebird\Image $image
     * @return mixed

    public function favorite(User $user, int $id)
    {
        $image = Image::find($id);
        return $user->id !== $image->user_id;
    }*/

    /**
     * Determine whether the user can restore the image.
     *
     * @param  \Bluebird\User  $user
     * @param  \Bluebird\Image  $image
     * @return mixed
     */
    public function restore(User $user, Image $image)
    {

    }

    /**
     * Determine whether the user can permanently delete the image.
     *
     * @param  \Bluebird\User  $user
     * @param  \Bluebird\Image  $image
     * @return mixed
     */
    public function forceDelete(User $user, Image $image)
    {
        return $user->id == $image->id;
    }
}
