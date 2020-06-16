<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixFeatureForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('feature_image_id');
            $table->dropColumn('feature_journal_id');
        });

        Schema::table('images', function (Blueprint $table) {
            $table->unsignedBigInteger('feature_user_id')->nullable();
            $table->foreign('feature_user_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('journals', function (Blueprint $table) {
            $table->unsignedBigInteger('feature_user_id')->nullable();
            $table->foreign('feature_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
