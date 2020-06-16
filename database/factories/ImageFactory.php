<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Bluebird\Image;
use Faker\Generator as Faker;

$factory->define(Bluebird\Image::class, function (Faker $faker) {
    $faker->addProvider(new \Mmo\Faker\PicsumProvider($faker));
    return [
        'title' => $faker->name,
        'description' => $faker->paragraph(),
        'image_url' => $faker->picsum(),
        'thumbnail_url' => $faker->picsum(),

    ];
});
