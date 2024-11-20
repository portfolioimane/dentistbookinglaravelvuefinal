<?php
namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    /**
     * Retrieve users with confirmed appointments and their associated phone numbers.
     */
    public function getPatientsWithConfirmedAppointments()
    {
        // Log the start of the method execution
        Log::info('Fetching patients with confirmed appointments...');

        try {
            // Fetch users with confirmed appointments along with their phone numbers
            $patients = DB::table('users')
                ->join('appointments', 'users.email', '=', 'appointments.email')
                ->where('appointments.status', 'confirmed')
                ->select('users.id', 'users.name', 'users.email', 'users.phone as user_phone', 'appointments.phone as appointment_phone')
                ->distinct()
                ->get();

            // Log the number of patients fetched
            Log::info('Number of patients fetched: ' . $patients->count());

            // If no patients were found, log the message
            if ($patients->isEmpty()) {
                Log::warning('No patients found with confirmed appointments.');
            }

            // Return the response as JSON
            return response()->json($patients);

        } catch (\Exception $e) {
            // Log any exceptions that occur
            Log::error('Error fetching patients with confirmed appointments: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch patients.'], 500);
        }
    }
}
