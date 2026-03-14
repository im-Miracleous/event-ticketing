<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TransactionDetail extends Model {
    protected $table = 'transaction_details';
    protected $fillable = ['subtotal', 'quantity', 'transaction_id', 'ticket_type_id'];
    public function transaction() { return $this->belongsTo(Transaction::class, 'transaction_id'); }
    public function ticketType() { return $this->belongsTo(TicketType::class, 'ticket_type_id'); }
    public function tickets() { return $this->hasMany(Ticket::class, 'transaction_detail_id'); }
}
