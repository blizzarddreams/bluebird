<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFeatureIdsToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('feature_image_id')->nullable();
            $table->unsignedBigInteger('feature_journal_id')->nullable();
            $table->foreign('feature_image_id')->references('id')->on('images')->onDelete('set null');
            $table->foreign('feature_journal_id')->references('id')->on('journals')->onDelete('set null');
        });

        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn('feature_user_id');
        });

        Schema::table('journals', function (Blueprint $table) {
            $table->dropColumn('feature_user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user', function (Blueprint $table) {
            //
        });
    }
}
