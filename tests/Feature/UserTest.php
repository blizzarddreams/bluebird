<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Bluebird\User;
use Bluebird\Follow;
use Bluebird\Journal;
use Bluebird\Favorite;
use Bluebird\Image;

class UserTest extends TestCase
{


    public function testShouldHasFollower()
    {
        $this->withoutMiddleware();
        $user2 = factory(User::class)->create();
        $user = factory(User::class)->create();
        $follow = factory(Follow::class)->create(['user_id' => $user2->id, 'following_id' => $user->id]);
        return $this->assertTrue($user->followers->contains($user2));
    }

    public function testShouldBeFollowing()
    {
        $this->withoutMiddleware();
        $user2 = factory(User::class)->create();
        $user = factory(User::class)->create();
        $follow = factory(Follow::class)->create(['user_id' => $user2->id, 'following_id' => $user->id]);
        return $this->assertTrue($user2->following->contains($user));
    }

    public function testShouldHasZeroFollowCount()
    {
        $this->withoutMiddleware();
        $user2 = factory(User::class)->create();
        $user = factory(User::class)->create();
        $follow = factory(Follow::class)->create(['user_id' => $user2->id, 'following_id' => $user->id]);
        $follow->delete();
        return $this->assertTrue($user->followers->count() === 0);
    }

    public function testShouldCreateJournalThenAttach()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $journal = factory(Journal::class)->create(['user_id' => $user->id]);
        return $this->assertTrue($user->journals->contains($journal));
    }

    public function testShouldFavoriteImage()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $image = factory(Image::class)->create([
            'user_id' => $user->id,
            'nsfw' => false
            ]);


        $favorite = factory(Favorite::class)->create(['image_id' => $image->id, 'user_id' => $user->id]);

        return $this->assertTrue($user->favorites->contains($image));
    }

   /* public function testShouldBeInvalidBecauseUsernameIsTaken()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create(['name' => 'bluebird']);
        $response = $this->json("POST", "/register", [
            'name' => 'bluebird',
            'password' => 'testtest',
            'password_confirmation' => 'testtest',
            'email' => 'a@a.com',
            'birthday' => now()
        ])->assertStatus(422)
            ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                "name" => [
                "The name has already been taken."
                ]
            ]
        ]);
    }

    public function testShouldBeInvalidBecausePasswordIsTooShort()
    {
        $this->withoutMiddleware();
        $response = $this->json("POST", "/register", [
            'name' => 'bluebirda',
            'password' => 'test',
            'password_confirmation' => 'test',
            'email' => 'a@a.com',
            'birthday' => now()
        ])->assertStatus(422)
            ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                "password" => [
                "The password must be at least 8 characters."
                ]
            ]
        ]);
    }

    public function testShouldBeInvalidBecausePasswordsDontMatch()
    {
        $this->withoutMiddleware();
        $response = $this->json("POST", "/register", [
            'name' => 'bluebirda',
            'password' => 'testtest',
            'password_confirmation' => 'testtest2',
            'email' => 'a@a.com',
            'birthday' => now()
        ])->assertStatus(422)
            ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                "password" => [
                "The password confirmation does not match."
                ]
            ]
        ]);
    }*/
}
