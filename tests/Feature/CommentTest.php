<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;
use Bluebird\User;
use Bluebird\Follow;
use Bluebird\Journal;
use Bluebird\Favorite;
use Bluebird\Image;
use Bluebird\Comment;

class CommentTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */


    public function testShouldPreventCommentOver4000Characters()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $this->be($user);
        $comment = factory(Comment::class)->create(['user_id' => $user->id]);
        $response = $this->json('POST', '/comment', [
            'data' => $comment->data,
            'user_id' => $comment->user_id,
            'comment_type' => 'image',
            'image_id' => 1
        ])->assertStatus(422)
        ->assertJson([
            'errors' => [
                'data' => ['The data field may not be greater than 4000 characters.']
            ],
        ]);
    }

    public function testShouldPreventCommentWithoutCommentType()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $this->be($user);
        $comment = factory(Comment::class)->create(['user_id' => $user->id, 'data' => Str::random(2000)]);
        $response = $this->json('POST', '/comment', [
            'data' => $comment->data,
            'user_id' => $comment->user_id,
            'image_id' => 1,
        ])->assertStatus(422)
        ->assertJson([
            'errors' => [
                'comment_type' => ['The comment type field is required.']
            ],
        ]);
    }

    public function testShouldSaveCommentToUser()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $this->be($user);
        $image = factory(Image::class)->create(['user_id' => $user->id, 'nsfw' => false]);
        $comment = factory(Comment::class)->make(['user_id' => $user->id, 'data' => Str::random(2000)]);
        $response = $this->json('POST', '/comment', [
            'data' => 'afewafewa',
            'user_id' => $user->id,
            'id' => $image->id,
            'comment_type' => 'image',
        ])->assertStatus(200)
            ->assertJson([

            ]);
        $comment = Comment::where(['user_id' => $user->id, 'image_id' => $image->id])->first();
        $this->assertTrue($user->comments->contains($comment));
    }

    public function testShouldSaveCommentToUserProfile()
    {
        $this->withoutMiddleware();
        $user = factory(User::class)->create();
        $this->be($user);
        $userProfile = factory(User::class)->create();

        $comment = factory(Comment::class)->make(['user_id' => $user->id, 'data' => Str::random(2000)]);

        $response = $this->json('POST', '/comment', [
            'data' => $comment->data,
            'user_id' => $user->id,
            'id' => $userProfile->id,
            'comment_type' => 'profile',
        ]);
        $comment = Comment::where(['user_id' => $user->id, 'profile_id' => $userProfile->id])->first();
        return $this->assertTrue($userProfile->profileComments->contains($comment));
    }
}
