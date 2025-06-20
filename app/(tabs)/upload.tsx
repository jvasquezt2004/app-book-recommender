import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Input, InputField } from "@/components/ui/input";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { API_BASE_URL } from "@/constants/api";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput } from "react-native";
import { Toast, ToastTitle, ToastDescription, useToast } from "@/components/ui/toast";

export default function UploadScreen() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const categories = [
    "Fiction", "Non-fiction", "Science Fiction", "Fantasy", "Mystery", "Romance", "Biography", "History", "Poetry", "Self-help", "Business", "Travel", "Religion", "Science", "Philosophy", "Art", "Thriller", "Horror", "Young Adult", "Children",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCategoryPickerOpen, setCategoryPickerOpen] = useState(false);
  
  const [isClassifying, setClassifying] = useState(false);
  const [descHeight, setDescHeight] = useState(100);
  const [isGenerating, setGenerating] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [3, 4],
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [3, 4],
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGenerateSummary = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      setGenerating(true);
      setSummary('');
      const response = await fetch(`${API_BASE_URL}/get_summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), original_description: description.trim() }),
      });
      const data = await response.json();
      if (data.summary_text) {
        setSummary(data.summary_text);
      } else if (data.error) {
        setSummary(`Error: ${data.error}`);
      } else {
        setSummary('Unknown response');
      }
    } catch (e) {
      console.error('Generate summary error →', e);
      setSummary('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const openPickerMenu = () => {
    setPickerOpen(true);
  };

  return (
    <GluestackUIProvider mode="dark">
      <ThemedView className="flex-1 p-4 pt-12 pb-4 flex-col">
        <ThemedView className="mb-4">
          <Text className="text-2xl font-bold text-white">Upload</Text>
        </ThemedView>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Pressable onPress={openPickerMenu} className="w-full">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 250, borderRadius: 12 }}
              contentFit="cover"
            />
          ) : (
            <ThemedView className="w-full h-64 rounded-xl bg-zinc-800 items-center justify-center border-2 border-dashed border-zinc-600">
              <IconSymbol name="square.and.arrow.up" size={56} color="#ffffff" />
              <Text className="mt-2 text-white">Add cover</Text>
            </ThemedView>
          )}
        </Pressable>

        {/* Form inputs */}
        <ThemedView className="mt-6 gap-4">
          <ThemedView className="gap-2">
            <Text className="text-sm font-semibold text-zinc-300">Title</Text>
            <Input variant="outline">
              <InputField placeholder="Title" value={title} onChangeText={setTitle} />
            </Input>
          </ThemedView>
          {/* Author */}
          <ThemedView className="gap-2 mt-4">
            <Text className="text-sm font-semibold text-zinc-300">Author</Text>
            <Input variant="outline">
              <InputField placeholder="Author" value={author} onChangeText={setAuthor} />
            </Input>
          </ThemedView>
          <ThemedView className="gap-2 mt-4">
            <Text className="text-sm font-semibold text-zinc-300">Description</Text>
            <TextInput
              placeholder="Description"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              onContentSizeChange={(e) => setDescHeight(Math.max(100, e.nativeEvent.contentSize.height))}
              style={{
                minHeight: 100,
                height: descHeight,
                textAlignVertical: 'top',
                color: 'white',
                borderWidth: 1,
                borderColor: '#4b5563',
                borderRadius: 6,
                padding: 12,
              }}
            />
          </ThemedView>

          {/* Category selector */}
          <ThemedView className="gap-2">
            <Text className="text-sm font-semibold text-zinc-300">Category</Text>
            <ThemedView className="flex-row items-center gap-2">
              <Pressable
                onPress={() => setCategoryPickerOpen(true)}
                className="flex-1 border border-zinc-600 rounded px-3 py-3"
              >
                <Text className="text-white">{selectedCategory || 'Select category'}</Text>
              </Pressable>
              <Button
                onPress={async () => {
                  const text = summary.trim() ? summary : description;
                  if (!text) return;
                  try {
                    setClassifying(true);
                    const resp = await fetch(`${API_BASE_URL}/classify_book`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: text }),
                    });
                    const data = await resp.json();
                    if (data.category) setSelectedCategory(data.category);
                    
                  } catch (e) {
                    console.error('classify error', e);
                  } finally {
                    setClassifying(false);
                  }
                }}
                action="primary"
                className="bg-emerald-700 px-4"
                disabled={isClassifying || (!summary.trim() && !description.trim())}
              >
                {isClassifying ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Auto classify</Text>
                )}
              </Button>
            </ThemedView>
          </ThemedView>

                    <Button
            onPress={handleGenerateSummary}
            action="primary"
            disabled={!title.trim() || !description.trim() || isGenerating}
            className="bg-emerald-700"
          >
            {isGenerating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white">Generate Summary</Text>
            )}
          </Button>

          {summary !== '' && (
            <ThemedView className="gap-2 mt-4">
              <Text className="text-sm font-semibold text-zinc-300">Summary</Text>
              <ThemedView className="border border-zinc-600 rounded bg-zinc-800 p-4">
                <Text className="text-white whitespace-pre-line">{summary}</Text>
              </ThemedView>
            </ThemedView>
          )}

          {/* Upload button */}
          <Button
            onPress={async () => {
              if (isUploading) return;
              try {
                setUploading(true);
                const payload = {
                  content: summary.trim(),
                  metadata: {
                    title: title.trim(),
                    author: author.trim(),
                    description: description.trim(),
                    category: selectedCategory,
                    cover_url: imageUri || '',
                  },
                };
                const resp = await fetch(`${API_BASE_URL}/upload_book`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const data = await resp.json();
                if (data.success) {
                  toast.show({
                    placement: 'top',
                    render: ({ id }) => (
                      <Toast nativeID={'toast-' + id} action="success" variant="solid">
                        <ToastTitle>Uploaded</ToastTitle>
                        <ToastDescription>Book saved successfully</ToastDescription>
                      </Toast>
                    ),
                  });
                } else {
                  throw new Error(data.error || 'Upload failed');
                }
              } catch (e: any) {
                toast.show({
                  placement: 'top',
                  render: ({ id }) => (
                    <Toast nativeID={'toast-' + id} action="error" variant="solid">
                      <ToastTitle>Error</ToastTitle>
                      <ToastDescription>{e.message || 'Failed to upload'}</ToastDescription>
                    </Toast>
                  ),
                });
              } finally {
                setUploading(false);
              }
            }}
            className="bg-indigo-700 mt-4"
            disabled={
              isUploading ||
              !summary.trim() ||
              !title.trim() ||
              !author.trim() ||
              !description.trim() ||
              !selectedCategory
            }
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white">Upload Book</Text>
            )}
          </Button>

          {summary !== '' && (
            <ThemedView className="gap-2 mt-4">
              <Text className="text-sm font-semibold text-zinc-300">Summary</Text>
              <ThemedView className="border border-zinc-600 rounded bg-zinc-800 p-4">
                <Text className="text-white whitespace-pre-line">{summary}</Text>
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
                {/* Category modal */}
        {isCategoryPickerOpen && (
          <Modal isOpen={isCategoryPickerOpen} onClose={() => setCategoryPickerOpen(false)} size="lg">
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Text className="text-lg font-bold text-white">Select Category</Text>
                <ModalCloseButton onPress={() => setCategoryPickerOpen(false)} />
              </ModalHeader>
              <ModalBody>
                <ScrollView style={{ maxHeight: 400 }}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setCategoryPickerOpen(false);
                      }}
                      className="py-3"
                    >
                      <Text className="text-white" style={{ opacity: selectedCategory === cat ? 1 : 0.8 }}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        </ScrollView>
        {isPickerOpen && (
          <Modal isOpen={isPickerOpen} onClose={() => setPickerOpen(false)} size="sm">
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Text className="text-lg font-bold text-white">Add cover</Text>
                <ModalCloseButton onPress={() => setPickerOpen(false)} />
              </ModalHeader>
              <ModalBody>
                <ThemedView className="gap-3">
                  <Button onPress={() => { setPickerOpen(false); takePhoto(); }} action="primary">
                    <Text className="text-white">Take photo</Text>
                  </Button>
                  <Button onPress={() => { setPickerOpen(false); pickFromGallery(); }} action="secondary" variant="outline">
                    <Text>Choose from gallery</Text>
                  </Button>
                </ThemedView>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </ThemedView>
    </GluestackUIProvider>
  );
}