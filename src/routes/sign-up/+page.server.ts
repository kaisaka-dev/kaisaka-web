import { redirect, type Actions } from '@sveltejs/kit'
import { z } from 'zod'

export type ActionData = 
  | { success: boolean, error: string }

const registrationFormValidator = z.object({
  username: z.string({ 
      required_error: "Username is required", 
      invalid_type_error: "Username is not a string"
    }).min(8, { message: "Username must be more than 8 characters in length"})
    .regex(/[A-Za-z_0-9]/),
  email: z.string()
    .email({ message: "Email is invalid"}),
  password: z.string({ 
      required_error: "Password is required", 
      invalid_type_error: "Password is not a string"
    }).min(8, { message: "Password must be 8 or more characters" }),
  confirmPassword: z.string({ 
    required_error: "Retype your password to confirm", 
    invalid_type_error: "Confirmed password does not match"
  })
})
.refine((passdata) => passdata.password === passdata.confirmPassword, {
  message: "Confirmed password does not match",
  path: ["confirmPassword"]
})

export const actions = {
  register: async (event): Promise<ActionData> => {
    const formData = await event.request.formData()
    const formDataObject = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    }

    const registrationResult = await registrationFormValidator.safeParseAsync(formDataObject)

    if (!registrationResult.success) {
      return redirect(303, `/sign-up?error=${encodeURIComponent(registrationResult.error.message)}`)
    }

    const response = await event.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formDataObject),
		    headers: {
			    'Content-Type': 'application/json',
        },
      }
    )

    console.log(response)

    if (!response.ok) {
      return redirect(303, `/sign-up?error=${encodeURIComponent(response.statusText)}`)
    }

    return redirect(303, `/sign-up?success=true`)
  }
} satisfies Actions