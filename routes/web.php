<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/


// todo: clean

//Route::get('/', 'HomeController@welcome');
//Route::get('/home', 'HomeController@welcome')->name('home');

//Auth::routes();

// Users

Route::get('/image/{id}', 'ImageController@show');
Route::post('/login', 'AuthController@login');
Route::get('/logout', 'AuthController@logout');
Route::post('/image/favorite', 'ImageController@favorite');
Route::post('/image/feature', 'ImageController@feature');
Route::get('/image/{id}/edit', 'ImageController@edit');
Route::get('/image/{id}/delete', 'ImageController@remove');
Route::post('/image/delete', 'ImageController@destroy');
Route::post('/image/edit', 'ImageController@update');
Route::get('/user/{name}', 'UserController@show');
Route::get('/user/{name}/gallery', 'UserController@gallery');
Route::get('/user/{name}/journals', 'UserController@journals');
Route::post('/comment', 'CommentController@store');
Route::get('/latest', 'ImageController@latest');
Route::post('/upload', 'ImageController@store');
Route::post('/write', 'JournalController@store');
Route::get('/notifications-all', 'UserController@notifications');
Route::post('/notifications/delete', 'UserController@deleteNotifications');
Route::get('/notifications-number', 'UserController@notificationsLength');
Route::post('/follow', 'UserController@follow');
Route::get('/search', 'ImageController@search');
Route::get('/journals/{id}', 'JournalController@show');
Route::get('/{path?}', [
    'uses' => 'HomeController@index',
    'as' => 'home',
    'where' => ['path' => '.*']
]);
//Route::get('/{route?}', 'HomeController@index');
/*Route::post('/settings/general', 'UserController@update')->name('settings.general')->middleware('auth');
Route::post('/settings/password', 'UserController@updatePassword')->name('settings.password')->middleware('auth');

Route::get('/@{name}', 'UserController@show')->name('profile');
Route::get('/settings', 'UserController@settings')->name('settings');
Route::get('/@{name}/gallery', 'UserController@gallery')->name('gallery');
Route::get('/@{name}/journals', 'UserController@journals')->name('journals');
Route::get('/@{name}/favorites', 'UserController@favorites')->name('favorites');
Route::get('/@{name}/following', 'UserController@following')->name('following');
Route::get('/@{name}/followers', 'UserController@followers')->name('followers');
Route::get('/notifications', 'UserController@notifications')->name("notifications");
Route::post("/notifications", 'UserController@deleteNotifications');
Route::post("/generate-new-token", 'UserController@token');
Route::post('/follow', 'UserController@follow');

// Images
Route::get('/image/{id}', 'ImageController@show')->name('image.view');
Route::get('/image/{id}/edit', 'ImageController@edit')->name('image.edit');
Route::get('/image/{id}/delete', 'ImageController@remove')->name('image.remove');
Route::get('/mass-delete', 'ImageController@massRemove')->name('image.mass-remove');
Route::get('/upload', 'ImageController@create')->name('upload');
Route::get('/search', 'ImageController@search')->name('search');
Route::post('/image/{id}/edit', 'ImageController@update');
Route::post('/image/{id}/delete', 'ImageController@destroy');
Route::post('/image/{id}/feature', 'ImageController@feature')->name('image.feature');
Route::post('/mass-delete', 'ImageController@massDestroy');
Route::post('/upload', 'ImageController@store');
Route::post('/favorite', 'ImageController@favorite');

// Journals
Route::get('/journal', 'JournalController@create')->name('journal.new')->middleware('auth');
Route::get('/journal/{id}', 'JournalController@show')->name('journal.view');
Route::get('/journal/{id}/edit', 'JournalController@edit')->name('journal.edit');
Route::get('/journal/{id}/delete', 'JournalController@remove')->name('journal.edit');
Route::post('/journal', 'JournalController@store');
Route::post('/feature/journal/{id}', 'JournalController@feature')->name('journal.feature')->middleware('auth');
Route::post('/journal/{id}/edit', 'JournalController@update');
Route::post('/journal/{id}/delete', 'JournalController@destroy');

// Comments
Route::get('/comment/{id}/edit', 'CommentController@edit')->name('comment.edit');
Route::get('/comment/{id}/delete', 'CommentController@remove')->name('comment.remove');
Route::post('/comment/{id}/edit', 'CommentController@update');
Route::post('/comment/{id}/delete', 'CommentController@destroy');
Route::post('/comment', 'CommentController@store')->middleware('auth');

// Github OAuth
Route::get('/auth/github', 'Auth\OAuthController@redirectToProviderGithub')->name('oauth.github');
Route::get('/auth/github/callback', 'Auth\OAuthController@handleProviderCallbackGithub');

// Google OAuth
Route::get('/auth/google', 'Auth\OAuthController@redirectToProviderGoogle')->name('oauth.google');
Route::get('/auth/google/callback', 'Auth\OAuthController@handleProviderCallbackGoogle');


*/
