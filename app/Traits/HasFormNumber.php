<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait HasFormNumber
{
    /**
     * Boot the trait.
     */
    public static function bootHasFormNumber(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->form_number) && empty($model->job_order_number)) {
                $model->setAttribute(
                    in_array('form_number', $model->getFillable()) ? 'form_number' : 'job_order_number',
                    static::generateFormNumber()
                );
            }
        });
    }

    /**
     * Generate a unique form number for the model.
     */
    public static function generateFormNumber(): string
    {
        $year = date('Y');
        $prefix = static::FORM_PREFIX;

        $lastRecord = static::whereYear('created_at', $year)->latest('id')->first();

        $sequence = $lastRecord
            ? (int) substr($lastRecord->getAttribute(
                in_array('form_number', (new static)->getFillable()) ? 'form_number' : 'job_order_number'
            ), -5) + 1
            : 1;

        return sprintf('%s-%s-%05d', $prefix, $year, $sequence);
    }

    /**
     * Get the display number for the model.
     */
    public function getDisplayNumberAttribute(): string
    {
        return $this->form_number ?? $this->job_order_number ?? $this->getKey();
    }
}
