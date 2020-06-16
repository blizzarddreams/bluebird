<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Bluebird\Comment;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Bluebird\Comment::class, function (Faker $faker) {
    return [
        'data' => Str::random(5000),
    ];
});
