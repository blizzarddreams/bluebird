<?php

namespace Bluebird\Policies;

use Bluebird\User;
use Bluebird\Follow;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function follow(User $user, User $followTarget)
    {
        return $user->id !== $followTarget->id;
    }

}
