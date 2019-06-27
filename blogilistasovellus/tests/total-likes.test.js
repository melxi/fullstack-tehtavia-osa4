const listHelper = require('../utils/list_helpers')

describe('total likes', () => {
    const blogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        }
      ]

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(7)
    })
})