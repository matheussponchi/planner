// Variáveis globais
let currentEditType = ""
let currentEditIndex = -1

// Banco de dados de exercícios por grupo muscular
const exerciseDatabase = {
  Peito: [
    "Supino reto",
    "Supino inclinado",
    "Supino declinado",
    "Crucifixo",
    "Crossover",
    "Flexão",
    "Supino com halteres",
    "Crucifixo inclinado",
    "Peck deck",
    "Paralelas",
    "Pullover",
    "Supino máquina",
  ],
  Costas: [
    "Puxada frontal",
    "Puxada atrás",
    "Remada curvada",
    "Remada sentada",
    "Barra fixa",
    "Remada unilateral",
    "Pulldown",
    "Remada T",
    "Levantamento terra",
    "Remada baixa",
    "Face pull",
    "Shrug",
  ],
  Pernas: [
    "Agachamento",
    "Leg press",
    "Extensão",
    "Flexão",
    "Afundo",
    "Stiff",
    "Cadeira adutora",
    "Cadeira abdutora",
    "Panturrilha em pé",
    "Panturrilha sentado",
    "Hack squat",
    "Búlgaro",
    "Passada",
  ],
  Ombros: [
    "Desenvolvimento",
    "Elevação lateral",
    "Elevação frontal",
    "Crucifixo inverso",
    "Desenvolvimento Arnold",
    "Remada alta",
    "Elevação posterior",
    "Military press",
    "Desenvolvimento com halteres",
    "Face pull",
    "Upright row",
    "Handstand push-up",
  ],
  Braços: [
    "Rosca direta",
    "Rosca martelo",
    "Rosca concentrada",
    "Tríceps testa",
    "Tríceps corda",
    "Mergulho",
    "Rosca 21",
    "Tríceps francês",
    "Rosca alternada",
    "Tríceps coice",
    "Barra fixa pegada fechada",
    "Diamond push-up",
  ],
  Cardio: [
    "Esteira",
    "Bicicleta",
    "Elíptico",
    "Remo",
    "Escada",
    "Corrida",
    "Caminhada",
    "HIIT",
    "Spinning",
    "Pular corda",
    "Burpees",
    "Mountain climbers",
  ],
  "Full Body": [
    "Burpees",
    "Thruster",
    "Clean and press",
    "Deadlift",
    "Squat to press",
    "Renegade row",
    "Turkish get-up",
    "Man makers",
    "Bear crawl",
    "Farmer's walk",
    "Kettlebell swing",
    "Battle ropes",
  ],
  Funcional: [
    "Agachamento livre",
    "Prancha",
    "Flexão",
    "Afundo",
    "Burpees",
    "Mountain climbers",
    "Jump squat",
    "Push-up",
    "Plank up",
    "Bear crawl",
    "Crab walk",
    "Jumping jacks",
  ],
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  updateCurrentDate()
  setDefaultDates()
  loadAllData()
})

// Atualizar data atual
function updateCurrentDate() {
  const now = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  document.getElementById("currentDate").textContent = now.toLocaleDateString("pt-BR", options)
}

// Definir datas padrão como hoje
function setDefaultDates() {
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("weightDate").value = today
  document.getElementById("workoutDate").value = today
  document.getElementById("studyDate").value = today
  document.getElementById("dailyDate").value = today
}

// Funções de armazenamento
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// SEÇÃO DE PESO
function addWeight() {
  const date = document.getElementById("weightDate").value
  const weight = document.getElementById("weightValue").value

  if (!date || !weight) {
    alert("Por favor, preencha a data e o peso!")
    return
  }

  const weights = getFromStorage("weights")
  const newWeight = {
    date: date,
    weight: Number.parseFloat(weight),
    timestamp: new Date().getTime(),
  }

  weights.push(newWeight)
  weights.sort((a, b) => new Date(b.date) - new Date(a.date))

  saveToStorage("weights", weights)
  displayWeights()

  // Limpar campos
  document.getElementById("weightValue").value = ""
}

function displayWeights() {
  const weights = getFromStorage("weights")
  const container = document.getElementById("weightHistory")

  if (weights.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum peso registrado ainda.</p>'
    return
  }

  container.innerHTML = weights
    .map(
      (weight, index) => `
        <div class="weight-entry">
            <div>
                <strong>${formatDate(weight.date)}</strong><br>
                <span style="font-size: 1.2rem; color: #667eea;">${weight.weight} kg</span>
            </div>
            <div class="entry-actions">
                <button class="btn-edit" onclick="editWeight(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteWeight(${index})">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function editWeight(index) {
  const weights = getFromStorage("weights")
  const weight = weights[index]

  currentEditType = "weight"
  currentEditIndex = index

  document.getElementById("modalTitle").textContent = "Editar Peso"
  document.getElementById("modalBody").innerHTML = `
        <input type="date" id="editWeightDate" value="${weight.date}" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #ddd; border-radius: 8px;">
        <input type="number" id="editWeightValue" value="${weight.weight}" step="0.1" min="0" placeholder="Peso (kg)" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
    `

  document.getElementById("editModal").style.display = "block"
}

function deleteWeight(index) {
  if (confirm("Tem certeza que deseja excluir este registro de peso?")) {
    const weights = getFromStorage("weights")
    weights.splice(index, 1)
    saveToStorage("weights", weights)
    displayWeights()
  }
}

// SEÇÃO DE TREINO
function addWorkout() {
  const date = document.getElementById("workoutDate").value
  const type = document.getElementById("workoutType").value
  const exercises = document.getElementById("workoutExercises").value

  if (!date || !type || !exercises) {
    alert("Por favor, preencha todos os campos do treino!")
    return
  }

  const workouts = getFromStorage("workouts")
  const newWorkout = {
    date: date,
    type: type,
    exercises: exercises,
    timestamp: new Date().getTime(),
  }

  workouts.push(newWorkout)
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date))

  saveToStorage("workouts", workouts)
  displayWorkouts()

  // Limpar campos
  document.getElementById("workoutType").value = ""
  document.getElementById("workoutExercises").value = ""
}

function displayWorkouts() {
  const workouts = getFromStorage("workouts")
  const container = document.getElementById("workoutHistory")

  if (workouts.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum treino registrado ainda.</p>'
    return
  }

  container.innerHTML = workouts
    .map(
      (workout, index) => `
        <div class="workout-entry">
            <h4>
                ${formatDate(workout.date)}
                <span class="workout-type">${workout.type}</span>
            </h4>
            <div class="workout-exercises">${workout.exercises}</div>
            <div class="entry-actions">
                <button class="btn-edit" onclick="editWorkout(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteWorkout(${index})">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function editWorkout(index) {
  const workouts = getFromStorage("workouts")
  const workout = workouts[index]

  currentEditType = "workout"
  currentEditIndex = index

  document.getElementById("modalTitle").textContent = "Editar Treino"
  document.getElementById("modalBody").innerHTML = `
        <input type="date" id="editWorkoutDate" value="${workout.date}" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #ddd; border-radius: 8px;">
        <select id="editWorkoutType" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #ddd; border-radius: 8px;">
            <option value="Peito" ${workout.type === "Peito" ? "selected" : ""}>Peito</option>
            <option value="Costas" ${workout.type === "Costas" ? "selected" : ""}>Costas</option>
            <option value="Pernas" ${workout.type === "Pernas" ? "selected" : ""}>Pernas</option>
            <option value="Ombros" ${workout.type === "Ombros" ? "selected" : ""}>Ombros</option>
            <option value="Braços" ${workout.type === "Braços" ? "selected" : ""}>Braços</option>
            <option value="Cardio" ${workout.type === "Cardio" ? "selected" : ""}>Cardio</option>
            <option value="Full Body" ${workout.type === "Full Body" ? "selected" : ""}>Full Body</option>
            <option value="Funcional" ${workout.type === "Funcional" ? "selected" : ""}>Funcional</option>
        </select>
        <textarea id="editWorkoutExercises" placeholder="Exercícios realizados" style="width: 100%; padding: 10px; min-height: 100px; border: 2px solid #ddd; border-radius: 8px; resize: vertical;">${workout.exercises}</textarea>
    `

  document.getElementById("editModal").style.display = "block"
}

function deleteWorkout(index) {
  if (confirm("Tem certeza que deseja excluir este treino?")) {
    const workouts = getFromStorage("workouts")
    workouts.splice(index, 1)
    saveToStorage("workouts", workouts)
    displayWorkouts()
  }
}

// SEÇÃO DE ATIVIDADES DIÁRIAS
function addDailyActivity() {
  const date = document.getElementById("dailyDate").value
  const activities = document.getElementById("dailyActivities").value

  if (!date || !activities) {
    alert("Por favor, preencha a data e as atividades!")
    return
  }

  const dailyActivities = getFromStorage("dailyActivities")

  // Verificar se já existe uma entrada para esta data
  const existingIndex = dailyActivities.findIndex((activity) => activity.date === date)

  if (existingIndex !== -1) {
    if (confirm("Já existe uma entrada para esta data. Deseja substituir?")) {
      dailyActivities[existingIndex] = {
        date: date,
        activities: activities,
        timestamp: new Date().getTime(),
      }
    } else {
      return
    }
  } else {
    const newActivity = {
      date: date,
      activities: activities,
      timestamp: new Date().getTime(),
    }
    dailyActivities.push(newActivity)
  }

  dailyActivities.sort((a, b) => new Date(b.date) - new Date(a.date))

  saveToStorage("dailyActivities", dailyActivities)
  displayDailyActivities()

  // Limpar campo
  document.getElementById("dailyActivities").value = ""
}

function displayDailyActivities() {
  const dailyActivities = getFromStorage("dailyActivities")
  const container = document.getElementById("dailyHistory")

  if (dailyActivities.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma atividade registrada ainda.</p>'
    return
  }

  container.innerHTML = dailyActivities
    .map(
      (activity, index) => `
        <div class="daily-entry">
            <h4>${formatDate(activity.date)}</h4>
            <div class="daily-activities">${activity.activities}</div>
            <div class="entry-actions">
                <button class="btn-edit" onclick="editDailyActivity(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteDailyActivity(${index})">Excluir</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function editDailyActivity(index) {
  const dailyActivities = getFromStorage("dailyActivities")
  const activity = dailyActivities[index]

  currentEditType = "daily"
  currentEditIndex = index

  document.getElementById("modalTitle").textContent = "Editar Atividades"
  document.getElementById("modalBody").innerHTML = `
        <input type="date" id="editDailyDate" value="${activity.date}" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #ddd; border-radius: 8px;">
        <textarea id="editDailyActivities" placeholder="Atividades do dia" style="width: 100%; padding: 10px; min-height: 120px; border: 2px solid #ddd; border-radius: 8px; resize: vertical;">${activity.activities}</textarea>
    `

  document.getElementById("editModal").style.display = "block"
}

function deleteDailyActivity(index) {
  if (confirm("Tem certeza que deseja excluir esta entrada de atividades?")) {
    const dailyActivities = getFromStorage("dailyActivities")
    dailyActivities.splice(index, 1)
    saveToStorage("dailyActivities", dailyActivities)
    displayDailyActivities()
  }
}

// SEÇÃO DE ESTUDOS
function addStudy() {
  const date = document.getElementById("studyDate").value
  const subject = document.getElementById("studySubject").value
  const content = document.getElementById("studyContent").value
  const studyTime = document.getElementById("studyTime").value
  const wasteTime = document.getElementById("wasteTime").value
  const distractionType = document.getElementById("distractionType").value

  if (!date || !subject || !content) {
    alert("Por favor, preencha a data, matéria e o que você aprendeu!")
    return
  }

  const studies = getFromStorage("studies")
  const newStudy = {
    date: date,
    subject: subject,
    content: content,
    studyTime: Number.parseInt(studyTime) || 0,
    wasteTime: Number.parseInt(wasteTime) || 0,
    distractionType: distractionType || "",
    timestamp: new Date().getTime(),
  }

  studies.push(newStudy)
  studies.sort((a, b) => new Date(b.date) - new Date(a.date))

  saveToStorage("studies", studies)
  displayStudies()

  // Limpar campos
  document.getElementById("studySubject").value = ""
  document.getElementById("studyContent").value = ""
  document.getElementById("studyTime").value = ""
  document.getElementById("wasteTime").value = ""
  document.getElementById("distractionType").value = ""
}

function displayStudies() {
  const studies = getFromStorage("studies")
  const container = document.getElementById("studyHistory")

  if (studies.length === 0) {
    container.innerHTML = "<p>Nenhum estudo registrado ainda.</p>"
    return
  }

  container.innerHTML = studies
    .map(
      (study, index) => `
        <div class="study-item">
            <div class="study-header">
                <div>
                    <strong>${formatDate(study.date)}</strong>
                    <span class="study-subject">${study.subject}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editStudy(${index})" class="edit-btn">✏️</button>
                    <button onclick="deleteStudy(${index})" class="delete-btn">🗑️</button>
                </div>
            </div>
            <div class="study-content">${study.content}</div>
            <div class="study-times">
                <span class="study-time">📚 ${study.studyTime} min</span>
                <span class="waste-time">🎮 ${study.wasteTime} min perdidos${study.distractionType ? ` (${study.distractionType})` : ""}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

function editStudy(index) {
  const studies = getFromStorage("studies")
  const study = studies[index]

  currentEditType = "study"
  currentEditIndex = index

  document.getElementById("modalTitle").textContent = "Editar Estudo"
  document.getElementById("modalBody").innerHTML = `
        <input type="date" id="editStudyDate" value="${study.date}" />
        <select id="editStudySubject">
            <option value="Inglês" ${study.subject === "Inglês" ? "selected" : ""}>Inglês</option>
            <option value="Programação" ${study.subject === "Programação" ? "selected" : ""}>Programação</option>
            <option value="Vídeos de Programação" ${study.subject === "Vídeos de Programação" ? "selected" : ""}>Vídeos de Programação</option>
            <option value="YouTube" ${study.subject === "YouTube" ? "selected" : ""}>YouTube</option>
        </select>
        <textarea id="editStudyContent" placeholder="O que você aprendeu?">${study.content}</textarea>
        <div class="time-inputs">
            <div class="time-group">
                <label>Tempo estudando (min):</label>
                <input type="number" id="editStudyTime" value="${study.studyTime}" min="0" />
            </div>
            <div class="time-group">
                <label>Tempo perdido (min):</label>
                <input type="number" id="editWasteTime" value="${study.wasteTime}" min="0" />
            </div>
            <div class="time-group">
                <label>Tipo de distração:</label>
                <input type="text" id="editDistractionType" value="${study.distractionType}" />
            </div>
        </div>
    `

  document.getElementById("editModal").style.display = "block"
}

function deleteStudy(index) {
  if (confirm("Tem certeza que deseja excluir este estudo?")) {
    const studies = getFromStorage("studies")
    studies.splice(index, 1)
    saveToStorage("studies", studies)
    displayStudies()
  }
}

// FUNÇÕES DO MODAL
function closeModal() {
  document.getElementById("editModal").style.display = "none"
  currentEditType = ""
  currentEditIndex = -1
}

function saveEdit() {
  if (currentEditType === "weight") {
    const weights = getFromStorage("weights")
    weights[currentEditIndex] = {
      date: document.getElementById("editWeightDate").value,
      weight: Number.parseFloat(document.getElementById("editWeightValue").value),
      timestamp: weights[currentEditIndex].timestamp,
    }
    saveToStorage("weights", weights)
    displayWeights()
  } else if (currentEditType === "workout") {
    const workouts = getFromStorage("workouts")
    workouts[currentEditIndex] = {
      date: document.getElementById("editWorkoutDate").value,
      type: document.getElementById("editWorkoutType").value,
      exercises: document.getElementById("editWorkoutExercises").value,
      timestamp: workouts[currentEditIndex].timestamp,
    }
    saveToStorage("workouts", workouts)
    displayWorkouts()
  } else if (currentEditType === "study") {
    const studies = getFromStorage("studies")
    studies[currentEditIndex] = {
      date: document.getElementById("editStudyDate").value,
      subject: document.getElementById("editStudySubject").value,
      content: document.getElementById("editStudyContent").value,
      studyTime: Number.parseInt(document.getElementById("editStudyTime").value) || 0,
      wasteTime: Number.parseInt(document.getElementById("editWasteTime").value) || 0,
      distractionType: document.getElementById("editDistractionType").value || "",
      timestamp: studies[currentEditIndex].timestamp,
    }
    saveToStorage("studies", studies)
    displayStudies()
  } else if (currentEditType === "daily") {
    const dailyActivities = getFromStorage("dailyActivities")
    dailyActivities[currentEditIndex] = {
      date: document.getElementById("editDailyDate").value,
      activities: document.getElementById("editDailyActivities").value,
      timestamp: dailyActivities[currentEditIndex].timestamp,
    }
    saveToStorage("dailyActivities", dailyActivities)
    displayDailyActivities()
  }

  closeModal()
}

// FUNÇÕES AUXILIARES
function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function loadAllData() {
  displayWeights()
  displayWorkouts()
  displayStudies()
  displayDailyActivities()
}

// Função para mostrar lista de exercícios
function showExerciseList() {
  const workoutType = document.getElementById("workoutType").value
  const exerciseListDiv = document.getElementById("exerciseList")
  const exerciseButtonsDiv = document.getElementById("exerciseButtons")

  if (workoutType && exerciseDatabase[workoutType]) {
    const exercises = exerciseDatabase[workoutType]

    exerciseButtonsDiv.innerHTML = exercises
      .map(
        (exercise) =>
          `<button type="button" class="exercise-btn" onclick="addExerciseToTextarea('${exercise}')">${exercise}</button>`,
      )
      .join("")

    exerciseListDiv.style.display = "block"
  } else {
    exerciseListDiv.style.display = "none"
  }
}

// Função para adicionar exercício ao textarea
function addExerciseToTextarea(exercise) {
  const textarea = document.getElementById("workoutExercises")
  const currentValue = textarea.value

  if (currentValue) {
    textarea.value = currentValue + "\n" + exercise + " "
  } else {
    textarea.value = exercise + " "
  }

  // Focar no textarea e posicionar cursor no final
  textarea.focus()
  textarea.setSelectionRange(textarea.value.length, textarea.value.length)
}

// Fechar modal clicando fora dele
window.onclick = (event) => {
  const modal = document.getElementById("editModal")
  if (event.target === modal) {
    closeModal()
  }
}
