class Follow < ActiveRecord::Base
  validates :follower_id, :followee_id, presence: true

  belongs_to :follower,
    class_name: 'User',
    primary_key: :id,
    foreign_key: :follower_id

  belongs_to :followee,
    class_name: 'User',
    primary_key: :id,
    foreign_key: :followee_id
end
