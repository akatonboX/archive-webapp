<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\TestResource;
class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dummy = [
            ['id' => 1],
            ['id' => 2],
            ['id' => 3],
        ];

        return TestResource::collection($dummy);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
