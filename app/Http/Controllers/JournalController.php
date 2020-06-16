<?php

namespace Bluebird\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Parsedown;
use Bluebird\Http\Requests\JournalRequest;
use Bluebird\Journal;
use Bluebird\Helpers;
use Bluebird\User;
use Illuminate\Support\Facades\Notification;
use Bluebird\Notifications\NewJournal;

class JournalController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', ['except' => ['show']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

     /**
     * Adds the journal as the featured image
     * @param int id
     * @return \Illuminate\Http\Response
     */
    public function feature(Request $request)
    {
        $user = Auth::user();
        $journal = Journal::find($request->id);
        if ($user->id === $journal->user_id) {
            if ($user->featured_journal_id == $journal->id) {
                // remove
                $user->featured_journal_id = null;
                $user->save();
                return response()->json(["success" => true, "featured" => false]);
            } else {
                $user->featured_journal_id = $journal->id;
                $user->save();
                return response()->json(["success" => true, "featured" => true]);
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('journal.new');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(JournalRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();
        $journal = Journal::create([
            'user_id' => $user->id,
            'title' => $validated->title,
            'data' => $validated->data,
        ]);
        $journal->save();

        Notification::send($user->followers, new NewJournal($journal));

        return response()->json(['success' => true]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $journal = Journal::with('user:id,name,email')->findOrFail($id);
        $user = User::findOrFail($journal->user_id);
        $journal->comments = collect($journal->comments)->map(function ($comment) {

            $comment->data = clean($comment->data);
            return $comment;
        });
        $journals = Journal
            ::whereHas('user', function ($query) use ($user) {
                $query->where('name', 'ILIKE', $user->name);
            })
           // ::with('user:id,name,email')
            //->where('journal.name', 'ILIKE', $user->name)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->transform(function ($item) {
                return $item->only(['id', 'title', 'created_at']);
            });
        //$journal->data = Helpers::updateData($journal->data);
        return response()->json(['success' => true, 'journal' => $journal, 'journals' => $journals]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
