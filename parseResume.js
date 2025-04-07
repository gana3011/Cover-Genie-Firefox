export async function parseResume(text){

    let name = text.match (/^[A-Z][a-z]+\s[A-Z][a-z]+\s?[A-Z]?/) || "Name not found";

    let email = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)?.[0] || "Email not found";

    let phone = text.match(/\b\d{10,15}\b/)?.[0] || "Phone not found";
    
    let education = text.match(/([A-Za-z\s]+(?:University|College|School|Institute|Academy))\s*(\d{4}(?:-\d{4})?)?\s*([\w\s,.-]*)?/g)|| "Education not found";

    let skills = text.match(/Skills:?([\s\S]*?)(?=\n\n|Experience|Education|$)/i)?.[1]?.trim() || "Skills not found";

    let experience = text.match(/Experience:?([\s\S]*?)(?=\n\n|Projects|Skills|Education|$)/i)?.[1]?.trim() || "Experience not found";
    
    return {name,email,phone,education,skills,experience};
}
