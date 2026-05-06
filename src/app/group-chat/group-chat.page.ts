import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatGroupInfoDto, ChatMessageDto } from '../dtos/chat-message.dto';

const CHAT_GROUPS: Record<number, ChatGroupInfoDto> = {
  1: { id: 1, name: 'Senderismo Urbano',    backgroundColor: '#4ECDC4', memberCount: 24 },
  2: { id: 2, name: 'Book Club Café',        backgroundColor: '#FF6584', memberCount: 12 },
  3: { id: 3, name: 'Fotografía Callejera',  backgroundColor: '#6C63FF', memberCount: 31 },
  4: { id: 4, name: 'Runners Matutinos',     backgroundColor: '#F7B731', memberCount: 18 },
  5: { id: 5, name: 'Cine & Debate',         backgroundColor: '#A55EEA', memberCount: 9  },
  6: { id: 6, name: 'Cocina del Mundo',      backgroundColor: '#FC5C65', memberCount: 15 },
  7: { id: 7, name: 'Yoga & Mindfulness',    backgroundColor: '#26de81', memberCount: 22 }
};

const CHAT_MESSAGES: Record<number, ChatMessageDto[]> = {
  1: [
    { id: 1,  senderId: 2, senderName: 'Ana García',   text: '¡Hola a todos! Recordatorio: el sábado salimos temprano 🥾', time: '8:00', isOwn: false, dateSeparator: 'Ayer' },
    { id: 2,  senderId: 3, senderName: 'Carlos López',  text: '¿A qué hora quedamos exactamente?', time: '8:05', isOwn: false },
    { id: 3,  senderId: 0, senderName: 'Tú',            text: 'Propongo las 8 AM en la entrada principal del parque', time: '8:10', isOwn: true },
    { id: 4,  senderId: 4, senderName: 'María Torres',  text: '¡Me parece bien! ¿Qué ruta hacemos?', time: '8:12', isOwn: false },
    { id: 5,  senderId: 2, senderName: 'Ana García',    text: 'La ruta norte, dura unas 2 horas y tiene unas vistas increíbles 🌄', time: '8:15', isOwn: false },
    { id: 6,  senderId: 0, senderName: 'Tú',            text: 'Perfecto, yo llevo el mapa por si acaso', time: '8:17', isOwn: true },
    { id: 7,  senderId: 3, senderName: 'Carlos López',  text: 'Yo llevo snacks para todos 🍫', time: '9:30', isOwn: false, dateSeparator: 'Hoy' },
    { id: 8,  senderId: 2, senderName: 'Ana García',    text: '¡El sábado salimos a las 8! No olviden el agua 💧', time: '10:42', isOwn: false },
  ],
  2: [
    { id: 1,  senderId: 5, senderName: 'Sofía Herrera', text: '¿Todos terminaron el libro?', time: '19:00', isOwn: false, dateSeparator: 'Lunes' },
    { id: 2,  senderId: 6, senderName: 'Javier Mora',   text: 'Casi, me quedan 2 capítulos 😅', time: '19:05', isOwn: false },
    { id: 3,  senderId: 0, senderName: 'Tú',            text: 'Yo lo terminé ayer, el final es increíble', time: '19:08', isOwn: true },
    { id: 4,  senderId: 5, senderName: 'Sofía Herrera', text: '¡Sin spoilers! El jueves lo discutimos con calma ☕', time: '19:10', isOwn: false },
    { id: 5,  senderId: 7, senderName: 'Elena Castro',  text: '¿Vamos al Café La Página como siempre?', time: '9:00', isOwn: false, dateSeparator: 'Hoy' },
    { id: 6,  senderId: 0, senderName: 'Tú',            text: 'Me encantó el final del capítulo 12', time: '9:15', isOwn: true },
  ],
  3: [
    { id: 1,  senderId: 8, senderName: 'Tomás Reyes',  text: 'El domingo a las 10 AM en la Plaza Mayor 📸', time: '18:00', isOwn: false, dateSeparator: 'Domingo' },
    { id: 2,  senderId: 9, senderName: 'Isabel Lara',  text: '¡Genial! ¿Hacemos street photography?', time: '18:05', isOwn: false },
    { id: 3,  senderId: 8, senderName: 'Tomás Reyes',  text: 'Exacto, la temática de este mes es "personas en movimiento"', time: '18:08', isOwn: false },
    { id: 4,  senderId: 0, senderName: 'Tú',           text: '¡Me apunto! Llevo la 50mm', time: '18:20', isOwn: true },
    { id: 5,  senderId: 10, senderName: 'Rafael Díaz', text: 'Yo igual, nos vemos el domingo 🤙', time: '18:35', isOwn: false },
    { id: 6,  senderId: 8, senderName: 'Tomás Reyes',  text: 'Subí las fotos de ayer al álbum compartido 📷', time: '9:00', isOwn: false, dateSeparator: 'Hoy' },
  ],
  4: [
    { id: 1,  senderId: 11, senderName: 'Carlos M.',   text: 'Mañana: ruta por el parque central, 6:30 AM ⏰', time: '21:00', isOwn: false, dateSeparator: 'Ayer' },
    { id: 2,  senderId: 12, senderName: 'Lucía R.',    text: '¡Ahí estaré! ¿Cuántos km son?', time: '21:10', isOwn: false },
    { id: 3,  senderId: 0,  senderName: 'Tú',          text: 'Unos 8 km, ritmo moderado', time: '21:15', isOwn: true },
    { id: 4,  senderId: 11, senderName: 'Carlos M.',   text: 'Recuerden hidratarse bien esta noche 💪', time: '21:20', isOwn: false },
  ],
  5: [
    { id: 1,  senderId: 13, senderName: 'Valentina',   text: '¿Qué película vemos el viernes?', time: '14:00', isOwn: false, dateSeparator: 'Lunes' },
    { id: 2,  senderId: 0,  senderName: 'Tú',          text: 'Voto por Dune II, la estoy esperando hace tiempo', time: '14:10', isOwn: true },
    { id: 3,  senderId: 14, senderName: 'Andrés B.',   text: '+1 para Dune II 🏜️', time: '14:12', isOwn: false },
    { id: 4,  senderId: 13, senderName: 'Valentina',   text: 'La próxima es el viernes, vemos Dune II 🍿', time: '15:00', isOwn: false },
  ],
  6: [
    { id: 1,  senderId: 15, senderName: 'Lucía P.',    text: '¿Alguien probó la receta de la semana pasada?', time: '11:00', isOwn: false, dateSeparator: 'Lunes' },
    { id: 2,  senderId: 0,  senderName: 'Tú',          text: 'Yo sí, quedó espectacular el curry 🍛', time: '11:30', isOwn: true },
    { id: 3,  senderId: 15, senderName: 'Lucía P.',    text: '¡Me alegra! Esta semana hacemos ramen 🍜', time: '11:35', isOwn: false },
    { id: 4,  senderId: 15, senderName: 'Lucía P.',    text: 'Receta del ramen enviada al grupo ✅', time: '12:00', isOwn: false },
  ],
  7: [
    { id: 1,  senderId: 16, senderName: 'Camila R.',   text: 'La clase de hoy fue muy relajante 🧘', time: '8:00', isOwn: false, dateSeparator: 'Hoy' },
    { id: 2,  senderId: 17, senderName: 'Martín S.',   text: 'Totalmente de acuerdo, justo lo que necesitaba', time: '8:05', isOwn: false },
    { id: 3,  senderId: 0,  senderName: 'Tú',          text: 'Gracias por la clase de hoy 🙏', time: '8:10', isOwn: true },
  ]
};

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
  standalone: false
})
export class GroupChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;

  group: ChatGroupInfoDto | null = null;
  messages: ChatMessageDto[] = [];
  newMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.group   = CHAT_GROUPS[id]   ?? null;
    this.messages = [...(CHAT_MESSAGES[id] ?? [])];
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  goBack() {
    this.router.navigate(['/tabs/my-groups']);
  }

  goToGroupDetail() {
    if (this.group) {
      this.router.navigate(['/group-detail', this.group.id]);
    }
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    const now = new Date();
    const time = now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

    this.messages.push({
      id: Date.now(),
      senderId: 0,
      senderName: 'Tú',
      text,
      time,
      isOwn: true
    });

    this.newMessage = '';
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 50);
  }
}
