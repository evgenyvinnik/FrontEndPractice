// import React from 'react'
// import useForm from 'react-hook-form';

interface Props {
  
}

export const PhoneInput = (props: Props) => {
  // const { register, handleSubmit } = useForm('(555) 555-5555');

  // const onSubmit = data => console.log(data);
  function onChange(target:any) {
    console.log(target.currentTarget);
  }

  return (
    <div>
     <input type="text" placeholder="(555) 555-5555" onChange={onChange} />
    </div>
  )
}

