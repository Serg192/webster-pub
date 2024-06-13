import { apiSlice } from "../../app/api/apiSlice";

export const canvasApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadCanvases: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/canvases?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    loadCanvas: builder.mutation({
      query: ({ id }) => ({
        url: `/canvases/${id}`,
        method: "GET",
      }),
    }),
    createCanvas: builder.mutation({
      query: ({ data }) => ({
        url: "/canvases",
        method: "POST",
        body: { ...data },
      }),
    }),
    deleteCanvas: builder.mutation({
      query: ({ id }) => ({
        url: `/canvases/${id}`,
        method: "DELETE",
      }),
    }),
    updateCanvas: builder.mutation({
      query: ({ id, data }) => ({
        url: `/canvases/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),

    uploadStageImg: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/canvases/${id}/stage-image`,
        method: "POST",
        body: formData,
      }),
    }),

    uploadCanvasPreviewImg: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/canvases/${id}/image`,
        method: "POST",
        body: formData,
      }),
    }),

    undoChange: builder.mutation({
      query: ({ id }) => ({
        url: `/canvases/${id}/undo`,
        method: "POST",
      }),
    }),

    redoChange: builder.mutation({
      query: ({ id }) => ({
        url: `/canvases/${id}/redo`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoadCanvasesMutation,
  useLoadCanvasMutation,
  useCreateCanvasMutation,
  useDeleteCanvasMutation,
  useUpdateCanvasMutation,
  useUploadStageImgMutation,
  useUploadCanvasPreviewImgMutation,
  useUndoChangeMutation,
  useRedoChangeMutation,
} = canvasApiSlice;
