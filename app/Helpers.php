<?php

namespace Bluebird;
use Bluebird\User;

class Helpers
{

    public static function updateData($string) {
        $string = clean($string);
        $string = Helpers::fromMarkdownToHTML($string);
        $string = Helpers::getUsernamesInText($string);
        return $string;

    }

    public static function fromMarkdownToHTML($string)
    {
       // $string_temp = $string;
        $replace = [
            ["/(?<!\\\\)\*(?<!\\\\)\*(.+)(?<!\\\\)\*(?<!\\\\)\*/", "<b>$1</b>"], // bold
            ["/(?<!\\\\)\*(.+)(?<!\\\\)\*/", "<i>$1</i>"], // italic
            ["/(?<!\\\\)~(?<!\\\\)~(.+)(?<!\\\\)~(?<!\\\\)~/", "<strike>$1</strike>"] // strikethrough
        ];
        foreach($replace as $i)
        {
            $string = preg_replace($i[0], $i[1], $string);
        }
       // return $string;
       return $string;
    }

    public static function getUsernamesInText($string)
    {
        return preg_replace_callback("/:{1}([A-Za-z0-9]+):{1}/", function($s) {
            $user = User::where('name', 'ILIKE', $s[1])->firstOrFail();
            return "<a href='".route('profile', $user->name)."'><img class='avatar-linked' src='https://www.gravatar.com/avatar/".md5($user->email)."'/>".$user->name."</a>";
        }, $string);
    }

}
