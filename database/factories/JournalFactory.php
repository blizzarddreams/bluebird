<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Bluebird\Model;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Bluebird\Journal::class, function (Faker $faker) {
    return [
        'title' => $faker->name,
        'data' => str::random(20000),

    ];
});
