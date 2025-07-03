<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    public $id;
    public function __construct($id) {
        $this->id = $id;
    }
}
