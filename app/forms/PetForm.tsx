import React, { FC, useMemo } from 'react'
import Input from '../components/admin/form-elements/Input'
import Select from '../components/admin/form-elements/Select'
import { isPetFormValid } from '../validations/validatePetForm'
import Textarea from '../components/admin/form-elements/Textarea'
import Spinner from '../components/common/Spinner'

interface PetFormProps {
  inputs: any
  errors: any
  handleInput: any
  close: any
  handleSubmit: any
  loading: boolean
}

const PetForm: FC<PetFormProps> = ({ inputs, errors, handleInput, close, handleSubmit, loading }) => {
  const isFormValid = useMemo(() => isPetFormValid(inputs), [inputs])

  return (
    <form onSubmit={handleSubmit} id="petForm" className="flex flex-col gap-y-4 pt-9 pb-24">
      <Input name="name" handleInput={handleInput} value={inputs?.name || ''} error={errors.name} />
      <Select
        name="type"
        handleInput={handleInput}
        value={inputs?.type || ''}
        list={['Select type', 'Dog', 'Cat']}
        error={errors?.type}
      />
      <Input name="breed" handleInput={handleInput} value={inputs?.breed || ''} error={errors.breed} />
      <Input name="age" type="string" handleInput={handleInput} value={inputs?.age || ''} error={errors?.age} />
      <Select
        name="gender"
        handleInput={handleInput}
        value={inputs?.gender || ''}
        list={['Select gender', 'Male', 'Female']}
        error={errors?.gender}
      />
      <Input
        name="weight"
        type="string"
        handleInput={handleInput}
        value={inputs?.weight || ''}
        error={errors?.weight}
      />
      <Textarea name="notes" handleInput={handleInput} value={inputs?.notes || ''} error={errors?.notes} />
      <div className="fixed bottom-0 right-0 w-[500px] z-50 bg-white border-t border-zinc-200 pt-4 px-5 pb-5 flex justify-end gap-x-4">
        <button
          type="button"
          onClick={() => close()}
          className="text-sm px-2 py-1 rounded-md font-medium flex items-center gap-x-1 border-1 border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="bg-indigo-500 disabled:bg-[#b7b2ff] text-white text-sm px-2 py-1 rounded-md font-medium flex items-center justify-center gap-x-1 min-w-[67.8px]"
        >
          {loading ? <Spinner fill="fill-white" track="text-indigo-500" wAndH="w-4 h-4" /> : 'Add pet'}
        </button>
      </div>
    </form>
  )
}

export default PetForm
