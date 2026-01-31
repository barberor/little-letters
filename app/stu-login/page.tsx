export default function StudentSignup() {
  return (
    <div>
      <h1>Student Sign Up</h1>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" name="name" />
        </div>
        
        <div>
          <label>School Email:</label>
          <input type="email" name="email" />
        </div>
        
        <div>
          <label>Hobbies & Interests:</label>
          <textarea name="hobbies"></textarea>
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}