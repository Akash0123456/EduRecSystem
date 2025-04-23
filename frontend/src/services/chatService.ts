import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { Message, RecentChat } from '../models/chat';
import { auth } from '../firebase';

// Collection names
const CHATS_COLLECTION = 'chats';
const MESSAGES_COLLECTION = 'messages';

// Get the current user's ID
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  console.log("Current user:", user); // Debug log
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
};

// Create a new chat
export const createChat = async (title: string): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    console.log("Creating chat with userId:", userId); // Debug log
    
    const chatData = {
      userId,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log("Chat data being sent:", chatData); // Debug log
    
    const docRef = await addDoc(collection(db, CHATS_COLLECTION), chatData);
    console.log("Chat created with ID:", docRef.id); // Debug log
    return docRef.id;
  } catch (error) {
    console.error("Error in createChat:", error); // Debug log
    throw error;
  }
};

// Update chat title
export const updateChatTitle = async (chatId: string, title: string): Promise<void> => {
  const userId = getCurrentUserId();
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  
  await updateDoc(chatRef, {
    title,
    updatedAt: serverTimestamp(),
  });
};

// Delete a chat
export const deleteChat = async (chatId: string): Promise<void> => {
  const userId = getCurrentUserId();
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  
  // Delete all messages in the chat
  const messagesQuery = query(
    collection(db, MESSAGES_COLLECTION),
    where('chatId', '==', chatId)
  );
  const messagesSnapshot = await getDocs(messagesQuery);
  const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
  
  // Delete the chat
  await Promise.all([...deletePromises, deleteDoc(chatRef)]);
};

// Add a message to a chat
export const addMessage = async (
  chatId: string, 
  message: Omit<Message, 'id' | 'timestamp'>,
  sources?: ChatSource[],
  analysisMethodology?: string
): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    console.log("Adding message with userId:", userId, "to chat:", chatId); // Debug log
    
    const messageData = {
      ...message,
      userId,
      timestamp: serverTimestamp(),
      sources: sources || [],
      analysisMethodology: analysisMethodology || '',
    };
    console.log("Message data being sent:", messageData); // Debug log
    
    const messagesRef = collection(db, `${CHATS_COLLECTION}/${chatId}/${MESSAGES_COLLECTION}`);
    const docRef = await addDoc(messagesRef, messageData);
    console.log("Message added with ID:", docRef.id); // Debug log
    
    // Update chat's updatedAt timestamp
    await updateDoc(doc(db, CHATS_COLLECTION, chatId), {
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error in addMessage:", error); // Debug log
    throw error;
  }
};

// Get all chats for the current user
export const getUserChats = async (): Promise<RecentChat[]> => {
  try {
    const userId = getCurrentUserId();
    console.log("Fetching chats for userId:", userId); // Debug log
    
    const chatsQuery = query(
      collection(db, CHATS_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(chatsQuery);
    console.log("Number of chats found:", querySnapshot.size); // Debug log
    
    const chats: RecentChat[] = [];
    for (const doc of querySnapshot.docs) {
      const chatData = doc.data();
      console.log("Chat data:", chatData); // Debug log
      
      // Get messages for this chat
      const messagesQuery = query(
        collection(db, `${CHATS_COLLECTION}/${doc.id}/${MESSAGES_COLLECTION}`),
        orderBy("timestamp", "asc")
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const messages = messagesSnapshot.docs.map(msgDoc => ({
        id: msgDoc.id,
        ...msgDoc.data(),
        timestamp: msgDoc.data().timestamp?.toDate() || new Date(),
      })) as Message[];
      
      chats.push({
        id: doc.id,
        title: chatData.title,
        time: chatData.updatedAt?.toDate().toLocaleString() || "Just now",
        active: false,
        icon: "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-10.svg",
        messages,
      });
    }
    
    return chats;
  } catch (error) {
    console.error("Error in getUserChats:", error); // Debug log
    throw error;
  }
};

// Get messages for a specific chat
export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const userId = getCurrentUserId();
  const messagesQuery = query(
    collection(db, MESSAGES_COLLECTION),
    where('chatId', '==', chatId),
    where('userId', '==', userId),
    orderBy('timestamp', 'asc')
  );
  
  const messagesSnapshot = await getDocs(messagesQuery);
  return messagesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      content: data.content,
      role: data.role,
      timestamp: data.timestamp?.toDate() || new Date(),
      sources: data.sources || [],
      analysisMethodology: data.analysisMethodology || '',
    };
  });
}; 