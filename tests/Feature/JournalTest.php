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

class JournalTest extends TestCase
{


    public function testShouldPreventDataBeingOver20000Characters()
    {
        $this->withoutMiddleware();
        $journal = factory(Journal::class)->make(['data' => str::random(24000)]);
        $user = factory(User::class)->create();
        $this->be($user);
        $response = $this->json('POST', '/write', [
            'data' => $journal->data,
            'user_id' => $user->id,
            'title' => $journal->title
        ])->assertStatus(422)
        ->assertJson([
            'errors' => [
                'data' => ['The data field may not be greater than 20000 characters.']
            ],
        ]);
    }
}
